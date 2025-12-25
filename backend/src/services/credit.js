export const consumeUserCredit = async (user) => {
    user.consumeCredit();
    await user.save();
};
  
export const addCreditsToUser = async (user, credits) => {
    console.log(user, credits, "addCreditsToUser");
    user.addPaidCredits(credits);
    await user.save();
};
  