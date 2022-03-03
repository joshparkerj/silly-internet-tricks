// link to poser: https://discuss.codecademy.com/t/can-this-problem-be-solved-with-code/651491/4
const reverseSimGame = (loserOfEachRound, finalDistributionOfCash) => (
  loserOfEachRound

    // start with the loser of the last round and work in reverse
    .reverse()
    .reduce(
      (roundResult, roundLoser) => {
        // all player numbers must match the index of an element of the finalDistributionOfCash
        if (roundLoser >= roundResult.length) {
          throw new Error('The player number is too high!');
        }

        if (roundLoser < 0) {
          throw new Error('The player number is too low!');
        }

        const amountPaidByLoser = roundResult.reduce(
          (runningTotal, playerCash, playerNumber) => (
            playerNumber === roundLoser ? runningTotal : runningTotal + playerCash
          ),
          0,
        );

        // return the calculated result of the previous round
        return roundResult.map(
          (playerCash, playerNumber) => (
            playerNumber === roundLoser ? playerCash + amountPaidByLoser / 2 : playerCash / 2
          ),
        );
      },
      finalDistributionOfCash,
    )
);

module.exports = { reverseSimGame };
