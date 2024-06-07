
const useCustomIDGenerator = () => {
  const generateCustomID = (category) => {
    let id = "";
    switch (category.toLowerCase()) {
      case "appetizers":
        id = "APP" + Date.now().toString(36);
        break;
      case "desserts":
        id = "DES" + Date.now().toString(36);
        break;
      case "beverages":
        id = "BEV" + Date.now().toString(36);
        break;
      default:
        id = "MNC" + Date.now().toString(36);
    }
    return id.toUpperCase();
  };

  return generateCustomID;
};

export default useCustomIDGenerator;
