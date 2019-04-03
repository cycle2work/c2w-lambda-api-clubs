import chai, { expect } from "chai";
import { spy } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { handler } from "index";
import {
    ACTIVITIES_COLLECTION,
    CLUBS_COLLECTION,
    REPORTS_COLLECTION,
    USERS_COLLECTION
} from "../src/config";

import activities from "./mocks/activities";
import reports from "./mocks/reports";
import users from "./mocks/users";
import { getMongoClient } from "services/mongo-db";

describe("`Cycle2work clubs data API function`", () => {
    let db;
    let context;
    let callback;

    before(async () => {
        db = await getMongoClient();

        await db.createCollection(CLUBS_COLLECTION);
        await db.createCollection(USERS_COLLECTION);
        await db.createCollection(REPORTS_COLLECTION);
        await db.createCollection(ACTIVITIES_COLLECTION);

        await db.collection(USERS_COLLECTION).insert(users);
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
        await db.dropCollection(CLUBS_COLLECTION);
        await db.dropCollection(USERS_COLLECTION);
        await db.dropCollection(REPORTS_COLLECTION);
        await db.dropCollection(ACTIVITIES_COLLECTION);
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
            { queryStringParameters: { month: "08", year: "2017", user: "2" } },
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
                        id: 148440,
                        distance: 50
                    },
                    {
                        id: 148445,
                        distance: 0
                    }
                ],
                activities: [
                    {
                        _id: 5,
                        month: 7,
                        year: "2017",
                        distance: 10,
                        athlete: {
                            id: 2
                        },
                        club: {
                            id: 2
                        }
                    }
                ],
                club: {
                    activities: [
                        {
                            _id: 4,
                            month: 8,
                            year: "2017",
                            distance: 25,
                            athlete: {
                                id: 1
                            },
                            club: {
                                id: 2
                            }
                        },
                        {
                            _id: 5,
                            month: 7,
                            year: "2017",
                            distance: 10,
                            athlete: {
                                id: 2
                            },
                            club: {
                                id: 2
                            }
                        }
                    ]
                }
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
                        id: 148440,
                        distance: 0
                    },
                    {
                        id: 148445,
                        distance: 0
                    }
                ],
                club: {}
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
