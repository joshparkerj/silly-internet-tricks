// link to poser: https://discuss.codecademy.com/t/can-this-problem-be-solved-with-code/651491/4

// A game is played by 3 players in which the one who loses must double the amount of money that
// each of the other 2 players has at that time.
// Each of the 3 players loses 1 game and at the conclusion of the 3 games each man has $16.
// How much money did each man start with?

// seems like a bit of a nonsense game.
// What if a player doesn't have enough to double the others' money?

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
            playerNumber === roundLoser ? runningTotal : runningTotal + playerCash / 2
          ),
          0,
        );

        // return the calculated result of the previous round
        return roundResult.map(
          (playerCash, playerNumber) => (
            playerNumber === roundLoser ? playerCash + amountPaidByLoser : playerCash / 2
          ),
        );
      },
      finalDistributionOfCash,
    )
);

module.exports = { reverseSimGame };
