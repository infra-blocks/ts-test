import * as chai from "chai";
import chaiPromise = require("chai-as-promised");
import sinonChai from "sinon-chai";

chai.use(chaiPromise);
chai.use(sinonChai);

export const expect = chai.expect;
