self.onmessage = function (e) {
  const { length = 12, quantity = 3 } = e.data;
 
  const allChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  function generatePassword() {
    const array = new Uint32Array(length);
    self.crypto.getRandomValues(array); // 
    let pw = "";
    for (let i = 0; i < length; i++) {
      pw += allChars[array[i] % allChars.length];
    }
    return pw;             
  }
 
  const passwords = [];
  for (let i = 0; i < quantity; i++) {
    passwords.push(generatePassword());
  }

 this.postMessage(passwords);
};
  