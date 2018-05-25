import chai, { expect } from "chai";
import { spy } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { handler } from "index";
import { ACTIVITIES_COLLECTION, CLUBS_COLLECTION, REPORTS_COLLECTION } from "config";

import activities from "./mocks/activities";
import reports from "./mocks/reports";
import { getMongoClient } from "services/mongo-db";

describe("`Cycle2work clubs data API function`", () => {
    let db;
    let context;
    let callback;

    before(async () => {
        db = await getMongoClient();
        await db.createCollection(REPORTS_COLLECTION);
        await db.collection(REPORTS_COLLECTION).insert(reports);
        await db.collection(ACTIVITIES_COLLECTION).insert(activities);

        await db
            .collection(CLUBS_COLLECTION)
            .insert({ _id: 148440, id: 148440, access_token: "12345" });
        await db
            .collection(CLUBS_COLLECTION)
            .insert({ _id: 148445, id: 148445, access_token: "12345" });
    });

    after(async () => {
        await db.dropCollection(ACTIVITIES_COLLECTION);
        await db.dropCollection(REPORTS_COLLECTION);
        await db.dropCollection(CLUBS_COLLECTION);
        await db.close();
    });

    beforeEach(() => {
        context = {
            succeed: spy()
        };
        callback = spy();
    });

    it("Return clubs activities data", async () => {
        await handler(
            { queryStringParameters: { month: "11", year: "2017", user: "2" } },
            context,
            callback
        );

        expect(callback).to.have.been.calledOnce;
        expect(callback.getCall(0).args[1]).to.deep.equal({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                reports: [
                    {
                        _id: 148440,
                        id: 148440,
                        distance: 450
                    },
                    {
                        _id: 148445,
                        id: 148445,
                        distance: 500
                    }
                ],
                activities: [
                    {
                        _id: 5,
                        distance: 10,
                        athlete: {
                            id: 2
                        }
                    }
                ]
            })
        });
    });

    it("Return empty clubs activities data", async () => {
        await handler({ queryStringParameters: { month: "02" } }, context, callback);

        expect(callback).to.have.been.calledOnce;
        expect(callback.getCall(0).args[1]).to.deep.equal({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                reports: [
                    {
                        _id: 148440,
                        id: 148440,
                        distance: 0
                    },
                    {
                        _id: 148445,
                        id: 148445,
                        distance: 0
                    }
                ]
            })
        });
    });

    it("Return error 400 Bad Request", async () => {
        await handler(null, context, callback);

        expect(callback).to.have.been.calledOnce;
        expect(callback.getCall(0).args[1]).to.deep.equal({
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                msg: "Error"
            })
        });
    });
});
