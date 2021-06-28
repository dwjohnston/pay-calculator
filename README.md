# pay-calculator
## To run

```
yarn
yarn test
```

## Assumptions 

- Pay periods are always whole months, and from the start of the month the end end of the month. 
- I haven't provided any 'read from CSV' functionality. I don't think that would add anything. The tests are the I/O. 
- The rounding only occurs in the pay period - and as it is demonstrated in the brief. 
## Other notes

- I've used date-fns to help with the pay period calculations. 
- Cool challenge. More difficult than it initially appears. 