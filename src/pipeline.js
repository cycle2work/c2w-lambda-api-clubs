import moment from "moment";

import uniqby from "lodash.uniqby";

import { log } from "./services/logger";
import {
    retrieveUserActivities,
    retrieveClubs,
    retrieveReports,
    retrieveUser,
    retrieveClubActivities
} from "./services/mongo-db";

export default async function pipeline(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        log.debug({ event });

        const { month, year, user } = event.queryStringParameters || {};

        const query = {
            month: parseInt(month) || moment.utc().month() + 1,
            year: parseInt(year) || moment.utc().year()
        };
        log.debug({ query });

        const reports = await retrieveReports(query);
        log.debug({ reports });

        const clubs = await retrieveClubs();
        log.debug({ clubs });

        const clubsReports = clubs.map(club => {
            const clubReports = reports.filter(x => x.club.id === club.id);
            const distance = clubReports.reduce((state, report) => {
                const total = report.distances.reduce((prev, current) => prev + current, 0);
                return state + total;
            }, 0);
            return {
                id: club.id,
                name: club.name,
                members: club.member_count,
                profile: club.profile,
                distance
            };
        });

        log.debug({ clubsReports });

        let userActivities;
        let clubActivities;

        if (user) {
            const retrivedUser = await retrieveUser({ id: parseInt(user) });
            // FIXME: Temporary get the first team
            const [club] = retrivedUser.clubs;

            const months = [parseInt(month), parseInt(month) - 1];
            log.debug({ club, retrivedUser, months });

            const activitiesYear = query.year.toString();

            if (retrivedUser) {
                userActivities = uniqby(
                    await retrieveUserActivities({
                        "athlete.id": parseInt(user),
                        month: { $in: months },
                        year: activitiesYear
                    }),
                    x => x.id
                );

                clubActivities = await retrieveClubActivities({
                    "club.id": club.id,
                    month: { $in: months },
                    year: activitiesYear
                });
            }
        }
        log.debug({ userActivities, clubActivities });

        const body = JSON.stringify({
            reports: clubsReports,
            activities: userActivities,
            club: { activities: clubActivities }
        });
        log.debug({ body });

        callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body
        });
    } catch (error) {
        log.debug({ error });

        const body = JSON.stringify({ msg: "Error" });
        log.debug({ body });

        callback(null, {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body
        });
    }
}
