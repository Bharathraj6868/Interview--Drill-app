# k6 Performance Testing

This directory contains performance testing scripts for the Interview Drills application using k6.

## Prerequisites

- Install k6: `npm install -g k6` or follow the [k6 installation guide](https://k6.io/docs/getting-started/installation/)
- The application must be running (use `make up` to start all services)

## Running the Tests

1. Start the application:
   ```bash
   make up
   ```

2. Wait for the application to be ready (check `make logs`)

3. Run the performance test:
   ```bash
   k6 run k6/script.js
   ```

4. View the results in the console and in the generated `performance-summary.json` file.

## Test Configuration

The test is configured to:
- Ramp up from 0 to 300 virtual users over 1.5 minutes
- Sustain 300 users for 1 minute
- Ramp down to 0 users over 30 seconds
- Target: p95 response time < 150ms for cached endpoints
- Target: < 1% error rate

## What's Tested

1. **Health Check** (`/api/health`)
   - Basic endpoint availability
   - Response format validation

2. **Drills List** (`/api/drills`)
   - Cached endpoint performance
   - Response time validation
   - Data format validation

3. **Individual Drill** (`/api/drills/:id`)
   - Dynamic endpoint performance
   - Response time validation

## Expected Results

For a well-performing application:
- **Drills list endpoint (cached)**: p95 < 150ms
- **Individual drill endpoint**: p95 < 150ms
- **Error rate**: < 1%
- **Throughput**: Should handle 300+ concurrent users

## Interpreting Results

### Key Metrics to Watch

1. **http_req_duration_p(95)**: 95th percentile response time
   - Target: < 150ms for cached routes
   - Critical for user experience

2. **http_req_failed**: Failed request rate
   - Target: < 1%
   - Indicates stability issues

3. **vus**: Virtual users
   - Shows concurrent user load

4. **http_reqs**: Total requests
   - Indicates throughput capacity

### Performance Bottlenecks

If the test fails, common issues to check:

1. **Database Connection**: Check MongoDB connection pooling
2. **Caching**: Verify in-memory cache is working
3. **Memory Usage**: Check for memory leaks
4. **CPU Usage**: Monitor server CPU during test
5. **Network**: Check network latency between services

## Improving Performance

If performance targets are not met:

1. **Database Optimization**
   - Add more indexes
   - Optimize queries
   - Increase connection pool size

2. **Caching Strategy**
   - Increase cache TTL
   - Implement Redis for distributed caching
   - Cache more endpoints

3. **Application Optimization**
   - Use response compression
   - Optimize middleware
   - Implement request batching

4. **Infrastructure**
   - Scale horizontally
   - Use load balancer
   - Optimize server resources

## Continuous Integration

To integrate these tests into your CI pipeline:

1. Add k6 test execution to your CI script
2. Set performance thresholds as pass/fail criteria
3. Generate performance reports for each build
4. Monitor performance trends over time

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure application is running on correct port
   - Check Docker containers are up

2. **High Response Times**
   - Check database performance
   - Verify caching is working
   - Monitor server resources

3. **High Error Rate**
   - Check application logs
   - Verify database connectivity
   - Ensure proper error handling

### Debug Commands

```bash
# Check if application is running
curl http://localhost:3000/api/health

# Check database connectivity
docker-compose exec mongo mongosh --eval "db.stats()"

# View application logs
make logs

# Check performance metrics
docker stats
```