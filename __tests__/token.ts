// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import dotenv from 'dotenv';
import { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLQuery, type GraphQLResponseBody } from './graphql.js';
import { httpsAgent, tokenPath } from './testserver.js';

// Load environment variables from .env file
dotenv.config();
const accessTokenEnv = dotenv.config().parsed?.ACCESS_TOKEN ?? '';
const tokenFromEnv = accessTokenEnv.trim() === '' ? undefined : accessTokenEnv;
if (tokenFromEnv === undefined || tokenFromEnv.trim() === '') {
    throw new Error(
        'ACCESS_TOKEN is not set in the environment variables or is empty.',
    );
}
// The redundant check for undefined has been removed.

type TokenResult = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    access_token: string;
};

const usernameDefault = 'admin';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const passwordDefault = 'p'; // NOSONAR

export const tokenRest = async (
    axiosInstance: AxiosInstance,
    username = usernameDefault,
    password = passwordDefault,
) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded', // eslint-disable-line @typescript-eslint/naming-convention
        // eslint-disable-next-line prettier/prettier, @typescript-eslint/naming-convention
        'Authorization': `Bearer ${tokenFromEnv}`,
    };
    const response: AxiosResponse<TokenResult> = await axiosInstance.post(
        tokenPath,
        `username=${username}&password=${password}`,
        { headers, httpsAgent },
    );
    return response.data.access_token;
};

export const tokenGraphQL = async (
    axiosInstance: AxiosInstance,
    username: string = usernameDefault,
    password: string = passwordDefault,
): Promise<string> => {
    const body: GraphQLQuery = {
        query: `
            mutation {
                token(
                    username: "${username}",
                    password: "${password}"
                ) {
                    access_token
                }
            }
        `,
    };

    const headers: Record<string, string> = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${tokenFromEnv}`,
    };

    const response: AxiosResponse<GraphQLResponseBody> =
        await axiosInstance.post('graphql', body, { headers, httpsAgent });

    const data = response.data.data!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    return data.token.access_token as string;
};
