import { VariantSpecs, VariantMatchResult, VariantMatchDifference } from '../types/index.js';

/**
 * Normalizes text for robust token and specification comparison
 */
function normalizeSpecValue(val?: string): string {
  if (!val) return '';
  return val
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Normalizes storage capacity to GB integer
 * e.g., "1TB" -> 1024, "512 GB" -> 512, "128gb" -> 128
 */
function normalizeStorage(val?: string): number | null {
  if (!val) return null;
  const clean = val.toLowerCase().replace(/\s+/g, '');
  if (clean.includes('tb')) {
    const num = parseFloat(clean.replace('tb', ''));
    return isNaN(num) ? null : num * 1024;
  }
  if (clean.includes('gb')) {
    const num = parseFloat(clean.replace('gb', ''));
    return isNaN(num) ? null : num;
  }
  const numeric = parseInt(clean, 10);
  return isNaN(numeric) ? null : numeric;
}

/**
 * PriceWise Exact Product Variant Matching Engine
 *
 * Implements requirement C:
 * - Brand check
 * - Model number check
 * - Storage capacity (e.g. 128GB vs 256GB)
 * - RAM (e.g. 8GB vs 16GB)
 * - Colour (e.g. Black vs Blue)
 * - Processor / Configuration
 * - Generation / Dimensions
 *
 * Confidence thresholds:
 * - 95-100%: Exact Variant Match
 * - 80-94%: Likely Match, Needs Verification
 * - Below 80%: Variant Difference Detected
 */
export function matchProductVariants(
  base: VariantSpecs,
  candidate: VariantSpecs
): VariantMatchResult {
  const differences: VariantMatchDifference[] = [];
  let score = 100;

  // 1. Brand matching (Critical - 40 points)
  const normBaseBrand = normalizeSpecValue(base.brand);
  const normCandBrand = normalizeSpecValue(candidate.brand);
  if (normBaseBrand && normCandBrand && normBaseBrand !== normCandBrand) {
    differences.push({
      specification: 'Brand',
      expected: base.brand,
      actual: candidate.brand,
      critical: true,
    });
    score -= 45;
  }

  // 2. Model matching (Critical - 30 points)
  const normBaseModel = normalizeSpecValue(base.model);
  const normCandModel = normalizeSpecValue(candidate.model);
  if (normBaseModel && normCandModel) {
    if (normBaseModel !== normCandModel) {
      // Check if candidate model is a substring or close variation
      if (normBaseModel.includes(normCandModel) || normCandModel.includes(normBaseModel)) {
        score -= 10;
        differences.push({
          specification: 'Model',
          expected: base.model,
          actual: candidate.model,
          critical: false,
        });
      } else {
        score -= 30;
        differences.push({
          specification: 'Model',
          expected: base.model,
          actual: candidate.model,
          critical: true,
        });
      }
    }
  }

  // 3. Storage capacity (Critical - 25 points)
  if (base.storage || candidate.storage) {
    const baseStorage = normalizeStorage(base.storage);
    const candStorage = normalizeStorage(candidate.storage);

    if (baseStorage !== null && candStorage !== null) {
      if (baseStorage !== candStorage) {
        differences.push({
          specification: 'Storage Capacity',
          expected: base.storage || `${baseStorage} GB`,
          actual: candidate.storage || `${candStorage} GB`,
          critical: true,
        });
        score -= 25;
      }
    } else if (base.storage && candidate.storage && normalizeSpecValue(base.storage) !== normalizeSpecValue(candidate.storage)) {
      differences.push({
        specification: 'Storage',
        expected: base.storage,
        actual: candidate.storage,
        critical: true,
      });
      score -= 20;
    }
  }

  // 4. RAM capacity (Critical - 15 points)
  if (base.ram || candidate.ram) {
    const baseRam = normalizeStorage(base.ram);
    const candRam = normalizeStorage(candidate.ram);

    if (baseRam !== null && candRam !== null) {
      if (baseRam !== candRam) {
        differences.push({
          specification: 'RAM',
          expected: base.ram || `${baseRam} GB`,
          actual: candidate.ram || `${candRam} GB`,
          critical: true,
        });
        score -= 15;
      }
    } else if (base.ram && candidate.ram && normalizeSpecValue(base.ram) !== normalizeSpecValue(candidate.ram)) {
      differences.push({
        specification: 'RAM',
        expected: base.ram,
        actual: candidate.ram,
        critical: false,
      });
      score -= 10;
    }
  }

  // 5. Processor / Hardware Configuration (15 points)
  if (base.processor && candidate.processor) {
    const normBaseProc = normalizeSpecValue(base.processor);
    const normCandProc = normalizeSpecValue(candidate.processor);
    if (normBaseProc !== normCandProc) {
      differences.push({
        specification: 'Processor / Chipset',
        expected: base.processor,
        actual: candidate.processor,
        critical: true,
      });
      score -= 15;
    }
  }

  // 6. Colour variation (Cosmetic - 4 points)
  if (base.color && candidate.color) {
    const normBaseCol = normalizeSpecValue(base.color);
    const normCandCol = normalizeSpecValue(candidate.color);
    if (normBaseCol !== normCandCol) {
      differences.push({
        specification: 'Colour',
        expected: base.color,
        actual: candidate.color,
        critical: false,
      });
      score -= 4; // Minimal penalty for color, but surfaced for accuracy
    }
  }

  // 7. Generation (10 points)
  if (base.generation && candidate.generation) {
    const normBaseGen = normalizeSpecValue(base.generation);
    const normCandGen = normalizeSpecValue(candidate.generation);
    if (normBaseGen !== normCandGen) {
      differences.push({
        specification: 'Generation',
        expected: base.generation,
        actual: candidate.generation,
        critical: true,
      });
      score -= 15;
    }
  }

  // Bound score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));

  if (finalScore >= 95) {
    const summaryNote = differences.length === 0
      ? 'Exact match across all primary hardware specifications, model identifier, and colorway.'
      : `Matching core specifications with minor cosmetic variation (${differences.map(d => d.specification).join(', ')}).`;

    return {
      confidenceScore: finalScore,
      label: 'Exact Variant Match',
      status: 'exact',
      differences,
      summaryNote,
    };
  }

  if (finalScore >= 80) {
    return {
      confidenceScore: finalScore,
      label: 'Likely Match, Needs Verification',
      status: 'likely',
      differences,
      summaryNote: `Specs are predominantly compatible, but ${differences.length} difference(s) detected: ${differences.map(d => `${d.specification} (${d.expected} vs ${d.actual})`).join(', ')}.`,
    };
  }

  return {
    confidenceScore: finalScore,
    label: 'Variant Difference Detected',
    status: 'mismatch',
    differences,
    summaryNote: `Significant variant mismatch detected: differs on ${differences.map(d => d.specification).join(', ')}. Do not treat as equivalent.`,
  };
}
