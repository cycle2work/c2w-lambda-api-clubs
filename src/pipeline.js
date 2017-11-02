import moment from "moment";

import { log } from "./services/logger";
import { retrieveClubs, retrieveReports } from "./services/mongo-db";

export default async function pipeline(event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    try {

        log.debug({ event });

        const { month, year } = event.queryStringParameters || {};

        const query = {
            month: month || moment.utc().format("MM"),
            year: year || moment.utc().year()
        };
        log.debug({ query });

        const reports = await retrieveReports(query);
        log.debug({ reports });

        const clubs = await retrieveClubs();
        log.debug({ clubs });

        const response = clubs.map(club => {
            const clubReports = reports.filter(x => x.club.id === club.id);
            const distance = clubReports.reduce((state, report) => {
                const total = report.distances.reduce((prev, current) => prev + current);
                return state + total;
            }, 0);
            delete club.access_token;
            return {
                ...club,
                distance
            };
        });

        log.debug({ response });

        const body = JSON.stringify({ reports: response });
        log.debug({ body });

        callback(null, {
            statusCode: 200,
            body
        });

    } catch (error) {
        log.debug({ error });

        const body = JSON.stringify({ msg: "Error" });
        log.debug({ body });

        callback(null, {
            statusCode: 400,
            body
        });
    }
}
