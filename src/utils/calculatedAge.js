export const calculatedAge = (birthDateInitial) => {
    const [day, month, year] = birthDateInitial.split("/");
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    const timeDiff = today.getTime() - birthDate.getTime();
    const ageDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
    return ageDiff;
}
