import chai, { expect } from "chai";
import { spy } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { handler } from "index";
import {
    CLUBS_COLLECTION,
    REPORTS_COLLECTION
} from "config";

import reports from "./mocks/reports";
import { getMongoClient } from "services/mongo-db";

describe("`Cycle2work clubs data API function`", () => {

    let db;
    let context;

    before(async () => {
        db = await getMongoClient();
        await db.createCollection(REPORTS_COLLECTION);
        await db.collection(REPORTS_COLLECTION).insert(reports);
        await db.collection(CLUBS_COLLECTION).insert({ _id: 148440, id: 148440 });
        await db.collection(CLUBS_COLLECTION).insert({ _id: 148445, id: 148445 });
    });

    after(async () => {
        await db.dropCollection(REPORTS_COLLECTION);
        await db.dropCollection(CLUBS_COLLECTION);
        await db.close();
    });

    beforeEach(() => {
        context = {
            succeed: spy()
        };
    });

    it("Return clubs activities data", async () => {
        await handler({ queryStringParameters: {} }, context);

        expect(context.succeed).to.have.been.calledOnce;
        expect(context.succeed.getCall(0).args[0]).to.deep.equal({
            statusCode: 200,
            body: JSON.stringify({
                reports: [
                    {
                        _id: 148440,
                        id: 148440,
                        distance: 450
                    }, {
                        _id: 148445,
                        id: 148445,
                        distance: 500
                    }
                ]
            })
        });

    });

});
