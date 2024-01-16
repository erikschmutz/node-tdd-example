import { SERVICES } from "./config";

function setUpServices() {
  SERVICES.forEach((service) => {
    service.register();
  });
}

export default setUpServices;
