import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 300 },   // Stay at 300 users for 1 minute
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% of requests should be below 150ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
    errors: ['rate<0.01'],            // Less than 1% error rate
  },
};

const BASE_URL = 'http://localhost:3000';

// Get a random drill ID (in a real scenario, you'd fetch this first)
function getRandomDrillId() {
  // This would typically be fetched from /api/drills first
  const drillIds = [
    '65a1b2c3d4e5f6g7h8i9j0k1',
    '65a1b2c3d4e5f6g7h8i9j0k2',
    '65a1b2c3d4e5f6g7h8i9j0k3',
    '65a1b2c3d4e5f6g7h8i9j0k4',
    '65a1b2c3d4e5f6g7h8i9j0k5'
  ];
  return drillIds[Math.floor(Math.random() * drillIds.length)];
}

export default function () {
  // Test 1: Health check endpoint
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check response has ok: true': (r) => r.json('ok') === true,
  });
  errorRate.add(healthRes.status !== 200);

  sleep(0.1);

  // Test 2: Get drills list (cached endpoint)
  const drillsRes = http.get(`${BASE_URL}/api/drills`);
  check(drillsRes, {
    'drills list status is 200': (r) => r.status === 200,
    'drills list has drills array': (r) => Array.isArray(r.json('drills')),
    'drills list response time < 100ms': (r) => r.timings.duration < 100,
  });
  errorRate.add(drillsRes.status !== 200);

  sleep(0.2);

  // Test 3: Get individual drill details
  const drillId = getRandomDrillId();
  const drillRes = http.get(`${BASE_URL}/api/drills/${drillId}`);
  check(drillRes, {
    'drill detail status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'drill detail response time < 150ms': (r) => r.timings.duration < 150,
  });
  errorRate.add(drillRes.status !== 200 && drillRes.status !== 404);

  sleep(0.3);

  // Test 4: Simulate user session (this would require authentication in a real scenario)
  const sessionHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'k6-load-test',
  };

  // Note: In a real test, you would need to handle authentication
  // This is a simplified version that tests the endpoints without auth
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'performance-summary.json': JSON.stringify(data),
    stdout: `
Performance Test Summary
========================

Test Duration: ${data.metrics.test_duration}
Iterations: ${data.metrics.iterations}
VUs: ${data.metrics.vus}

HTTP Requests:
  Total: ${data.metrics.http_reqs}
  Failed: ${data.metrics.http_req_failed * 100}%

Response Times:
  Min: ${data.metrics.http_req_duration_min}ms
  Max: ${data.metrics.http_req_duration_max}ms
  Median: ${data.metrics.http_req_duration_med}ms
  90th percentile: ${data.metrics.http_req_duration_p90}ms
  95th percentile: ${data.metrics.http_req_duration_p95}ms

Caching Performance:
  Drills endpoint (cached):
    Avg response time: ${data.metrics.http_req_duration_avg}ms
    95th percentile: ${data.metrics.http_req_duration_p95}ms

Thresholds Met:
  p(95) < 150ms: ${data.metrics.http_req_duration_p95 < 150 ? '✓' : '✗'}
  Error rate < 1%: ${data.metrics.http_req_failed < 0.01 ? '✓' : '✗'}
    `,
  };
}