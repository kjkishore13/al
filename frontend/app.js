/**
 * Market State Probability Engine - Frontend
 */

const API_URL = 'http://localhost:8000';

// DOM Elements
const stockInput = document.getElementById('stock-input');
const exchangeSelect = document.getElementById('exchange-select');
const timeframeSelect = document.getElementById('timeframe-select');
const signalSelect = document.getElementById('signal-select');
const periodSelect = document.getElementById('period-select');
const analyzeBtn = document.getElementById('analyze-btn');

const loading = document.getElementById('loading');
const metrics = document.getElementById('metrics');
const stats = document.getElementById('stats');
const explanation = document.getElementById('explanation');

// Metric Elements
const continuationEl = document.getElementById('continuation');
const reversalEl = document.getElementById('reversal');
const sidewaysEl = document.getElementById('sideways');
const confidenceEl = document.getElementById('confidence');
const samplesEl = document.getElementById('samples');
const evEl = document.getElementById('ev');
const winrateEl = document.getElementById('winrate');

// Stats Elements
const avgGainEl = document.getElementById('avg-gain');
const avgDdEl = document.getElementById('avg-dd');
const riskScoreEl = document.getElementById('risk-score');
const decisionScoreEl = document.getElementById('decision-score');
const priceEl = document.getElementById('price');
const trendEl = document.getElementById('trend');
const ema9El = document.getElementById('ema9');
const ema21El = document.getElementById('ema21');
const ema200El = document.getElementById('ema200');
const rsiEl = document.getElementById('rsi');

// AI Explanation
const aiTextEl = document.getElementById('ai-text');

// ============================================================
// EVENT LISTENERS
// ============================================================

analyzeBtn.addEventListener('click', analyzeMarket);
document.getElementById('copy-btn').addEventListener('click', copyExplanation);
document.getElementById('excel-btn').addEventListener('click', downloadExcel);
document.getElementById('report-btn').addEventListener('click', generateReport);

// Enter key support
stockInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') analyzeMarket();
});

// ============================================================
// MAIN ANALYSIS FUNCTION
// ============================================================

async function analyzeMarket() {
    const symbol = stockInput.value.trim().toUpperCase();
    if (!symbol) {
        alert('Please enter a stock symbol');
        return;
    }

    // Show loading
    loading.style.display = 'block';
    metrics.style.display = 'none';
    stats.style.display = 'none';
    explanation.style.display = 'none';

    try {
        const request = {
            symbol: symbol,
            exchange: exchangeSelect.value,
            timeframe: timeframeSelect.value,
            signal_type: signalSelect.value,
            period: periodSelect.value,
        };

        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Analysis failed');
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
    } finally {
        loading.style.display = 'none';
    }
}

// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(data) {
    // Metrics
    continuationEl.textContent = data.continuation_prob + '%';
    continuationEl.className = 'metric-value ' + getColorClass(data.continuation_prob, 'cont');

    reversalEl.textContent = data.reversal_prob + '%';
    reversalEl.className = 'metric-value ' + getColorClass(data.reversal_prob, 'rev');

    sidewaysEl.textContent = data.sideways_prob + '%';
    sidewaysEl.className = 'metric-value ' + getColorClass(data.sideways_prob, 'side');

    confidenceEl.textContent = data.confidence + '%';
    confidenceEl.className = 'metric-value ' + getColorClass(data.confidence, 'conf');

    samplesEl.textContent = data.sample_size;
    evEl.textContent = data.expected_value + '%';
    evEl.className = 'metric-value ' + getColorClass(data.expected_value, 'ev');

    winrateEl.textContent = data.win_rate + '%';
    winrateEl.className = 'metric-value ' + getColorClass(data.win_rate, 'win');

    // Stats
    avgGainEl.textContent = data.avg_gain + '%';
    avgDdEl.textContent = data.avg_drawdown + '%';
    riskScoreEl.textContent = data.risk_score;
    decisionScoreEl.textContent = data.decision_score;

    priceEl.textContent = '₹' + data.current_price.toFixed(2);
    trendEl.textContent = data.trend;
    trendEl.style.color = data.trend.includes('Bullish') ? '#4ade80' : data.trend.includes('Bearish') ? '#f87171' : '#fbbf24';

    // Indicators
    if (data.indicators) {
        ema9El.textContent = data.indicators.ema9.toFixed(2);
        ema21El.textContent = data.indicators.ema21.toFixed(2);
        ema200El.textContent = data.indicators.ema200.toFixed(2);
        rsiEl.textContent = data.indicators.rsi.toFixed(1);
    }

    // AI Explanation
    aiTextEl.textContent = data.explanation;

    // Show all sections
    metrics.style.display = 'grid';
    stats.style.display = 'grid';
    explanation.style.display = 'block';

    // Scroll to results
    metrics.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// HELPERS
// ============================================================

function getColorClass(value, type) {
    if (type === 'cont') {
        if (value >= 60) return 'positive';
        if (value >= 45) return 'neutral';
        return 'negative';
    }
    if (type === 'rev') {
        if (value >= 60) return 'negative';
        if (value >= 40) return 'neutral';
        return 'positive';
    }
    if (type === 'side') {
        if (value >= 40) return 'neutral';
        return 'positive';
    }
    if (type === 'conf') {
        if (value >= 70) return 'positive';
        if (value >= 40) return 'neutral';
        return 'negative';
    }
    if (type === 'ev' || type === 'win') {
        if (value > 0) return 'positive';
        if (value === 0) return 'neutral';
        return 'negative';
    }
    return '';
}

// ============================================================
// COPY EXPLANATION
// ============================================================

function copyExplanation() {
    const text = aiTextEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = original;
        }, 2000);
    });
}

// ============================================================
// DOWNLOAD EXCEL (Mock)
// ============================================================

function downloadExcel() {
    alert('Excel download will be available in production version.\nData: ' + stockInput.value);
}

// ============================================================
// GENERATE REPORT (Mock)
// ============================================================

function generateReport() {
    alert('Full report will be generated in production version.\nStock: ' + stockInput.value);
}

console.log('🚀 Market State Probability Engine loaded');
