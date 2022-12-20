import { environment } from "./environment";
import { environment as environment_dev } from "./environment.dev";
import { environment as environment_qa } from "./environment.qa";
import { environment as environment_hml } from "./environment.hml";
import { environment as environment_sandbox } from "./environment.sandbox";
import { environment as environment_prod } from "./environment.prod";
import { environment as environment_pipeline } from "./environment.pipeline";

export function getEnvironment() {
  switch (process.env.STAGE) {
    case "pipeline": {
      return environment_pipeline;
    }
    case "dev": {
      return environment_dev;
    }
    case "qa": {
      return environment_qa;
    }
    case "sandbox": {
      return environment_sandbox;
    }
    case "hml": {
      return environment_hml;
    }
    case "prod": {
      return environment_prod;
    }
    default: {
      return environment;
    }
  }
}
