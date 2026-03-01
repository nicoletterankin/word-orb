export interface WordOrbOptions {
  /** Your Word Orb API key (starts with wo_). Get one free at /pricing */
  apiKey?: string;
  /** API base URL. Defaults to https://word-orb-api.nicoletterankin.workers.dev */
  baseUrl?: string;
}

export interface WordResult {
  /** The word that was looked up */
  word: string;
  /** IPA pronunciation (e.g., /ˈkɜːɹ.ɪdʒ/) */
  ipa: string | null;
  /** Part of speech (noun, verb, adjective, etc.) */
  pos: string | null;
  /** Full definition */
  def: string;
  /** Etymology and word origin */
  etym: string | null;
  /** Kelly's personal insight on this word */
  kelly_says: string | null;
  /** Age-appropriate definition for children (5-12) */
  child_def: string | null;
  /** Age-appropriate definition for teenagers (13-17) */
  teen_def: string | null;
  /** Full adult definition */
  adult_def: string | null;
  /** Semantically connected words */
  connections: string[] | string | null;
  /** Translations across up to 47 languages. Object keyed by language code, or array of {code, word, pron} */
  langs: Record<string, string> | Array<{ code: string; word: string; pron: string }>;
  /** Age-appropriate tone variants. Object keyed by tone label, or array of {label, text} */
  tones: Record<string, string> | Array<{ label: string; text: string }>;
  /** Data source indicator */
  _source: string;
  /** API tier that served this response */
  _tier: string;
}

export interface WordListResult {
  /** Total number of words in the library */
  count: number;
  /** Array of word summaries */
  words: Array<{
    word: string;
    ipa: string | null;
    pos: string | null;
    lookups: number;
  }>;
}

export interface FeedbackResult {
  ok: boolean;
}

export interface AuditResult {
  /** Unique audit identifier */
  audit_id: string;
  /** Overall compliance grade (A+ through F) */
  grade: string;
  /** Numeric compliance score (0-100) */
  compliance_score: number;
  /** Human-readable summary */
  message: string;
  /** Total words audited */
  total_words: number;
  /** Coverage breakdown */
  coverage: {
    in_word_orb_library: number;
    missing_from_library: number;
    with_translations: number;
    with_age_tones: number;
    with_ethics_data: number;
  };
  /** Individual word findings */
  findings: Array<{
    word: string;
    category: string;
    severity: string;
    message: string;
    suggestion: string;
  }>;
  /** Gap analysis */
  gaps: {
    not_in_library: string[];
    no_translations: string[];
    no_age_tones: string[];
    no_ethics_review: string[];
  };
  /** Overall recommendation */
  recommendation: string;
  /** Suggested next steps */
  next_steps: Record<string, string>;
}

export interface KeyStatus {
  /** The API key (masked) */
  key: string;
  /** Account email */
  email: string;
  /** Current tier: free, starter, growth, enterprise */
  tier: string;
  /** Human-readable tier name */
  tier_label: string;
  /** Maximum daily API calls (-1 for unlimited) */
  daily_limit: number | string;
  /** Calls made today */
  calls_today: number;
  /** Lifetime total calls */
  calls_total: number;
  /** Remaining calls today ("unlimited" for enterprise) */
  remaining_today: number | string;
  /** Whether the key is active */
  active: boolean;
  /** Key creation timestamp */
  created_at: string;
  /** URL to upgrade tier (null if already enterprise) */
  upgrade_url: string | null;
}

export interface SignupResult {
  /** Your new API key (starts with wo_) */
  key: string;
  /** Assigned tier (always "free" for signup) */
  tier: string;
  /** Daily call limit */
  daily_limit: number;
  /** Confirmation message */
  message: string;
  /** True if email already had a key */
  existing?: boolean;
  /** Quick-start code snippets */
  quickstart?: {
    curl: string;
    javascript: string;
    python: string;
  };
}

export interface HealthResult {
  /** Overall status: "healthy" or "degraded" */
  status: string;
  /** Individual system checks */
  checks: Record<string, string>;
  /** Timestamp */
  ts: string;
  /** API version */
  version: string;
}

export interface StatsResult {
  /** Total words in D1 database */
  d1_words: number;
  /** Words cached in KV */
  kv_cached: number;
  /** Total feedback entries */
  feedback: number;
  /** Number of active API keys */
  active_keys: number;
  /** Tier information */
  tiers: Record<string, { daily_limit: number | string; price: string }>;
  /** Timestamp */
  ts: string;
}

export declare class WordOrb {
  /** Current API key */
  apiKey?: string;
  /** API base URL */
  baseUrl: string;

  /**
   * Create a Word Orb client.
   * @param options - Configuration options
   * @example
   * ```js
   * const orb = new WordOrb({ apiKey: 'wo_your_key' });
   * ```
   */
  constructor(options?: WordOrbOptions);

  /**
   * Look up any word — definition, pronunciation, etymology, translations, age tones, and Kelly's insight.
   * @param w - The word to look up
   * @returns Full word data including translations and tones
   * @example
   * ```js
   * const data = await orb.word('serendipity');
   * console.log(data.def, data.ipa, data.kelly_says);
   * ```
   */
  word(w: string): Promise<WordResult>;

  /**
   * Get the full word library listing.
   * @returns Word count and array of word summaries
   */
  words(): Promise<WordListResult>;

  /**
   * Submit vocabulary feedback (upvote or downvote a definition).
   * @param word - The word to give feedback on
   * @param vote - 1 for upvote, -1 for downvote
   * @param correction - Optional correction text
   */
  feedback(word: string, vote: 1 | -1, correction?: string): Promise<FeedbackResult>;

  /**
   * Run a Kelly Certified compliance audit on a word list.
   * Free for everyone — audit your agent's vocabulary for ethics, inclusivity, and age-appropriateness.
   * @param email - Your email (required for report delivery)
   * @param words - Array of words your agent uses
   * @returns Detailed compliance report with grade, findings, and gaps
   * @example
   * ```js
   * const report = await orb.audit('cto@company.com', ['feel', 'understand', 'help']);
   * console.log(report.grade); // 'B+'
   * ```
   */
  audit(email: string, words: string[]): Promise<AuditResult>;

  /**
   * Sign up for a free API key. 50 lookups per day.
   * @param email - Your email address
   * @returns API key and quickstart code snippets
   * @example
   * ```js
   * const { key } = await orb.signup('dev@company.com');
   * // key: 'wo_abc123...'
   * ```
   */
  signup(email: string): Promise<SignupResult>;

  /**
   * Check your API key usage, tier, and remaining calls.
   * @returns Current key status and usage statistics
   */
  me(): Promise<KeyStatus>;

  /**
   * Get service health status.
   * @returns Health check results for all subsystems
   */
  health(): Promise<HealthResult>;

  /**
   * Get database size and usage statistics.
   * @returns Word count, key count, and tier information
   */
  stats(): Promise<StatsResult>;
}
