import application from "./application";
import getServer from "./server";
import setUpServices from "./services";

async function bootstrap() {
  setUpServices();

  const server = await getServer();
  const port = application().env.PORT ?? 8080;

  server.listen(application().env.PORT ?? 8080, () => {
    console.log(`Listening on http://localhost:${port}`);
  });

  await application()
    .events.when("errors")

    .retry(5)
    .then((error) => {
      console.log(error.message);
      throw new Error("123");
    });
}

async function cleanup() {}

bootstrap();
