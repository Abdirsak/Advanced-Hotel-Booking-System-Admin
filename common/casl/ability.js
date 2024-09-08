// Import necessary modules
import { createMongoAbility } from "@casl/ability";
import { initialAbility } from "./initialAbility";

let userData;

if (typeof window !== "undefined") {
  const userDataString = localStorage.getItem("userData");

  userData = userDataString ? JSON.parse(userDataString) : null;
} else {
  console.warn(
    "Running in a non-browser environment, skipping localStorage access."
  );
}

const existingAbility = userData && userData.role ? userData.role.ability : [];

export default createMongoAbility(
  existingAbility.length ? existingAbility : initialAbility
);
