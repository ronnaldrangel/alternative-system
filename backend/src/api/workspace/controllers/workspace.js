'use strict';

/**
 * workspace controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::workspace.workspace', ({ strapi }) => ({
    async create(ctx) {
        const { user } = ctx.state;
        if (!user) {
            return ctx.unauthorized('You must be logged in to create a workspace');
        }

        const { data } = ctx.request.body;

        try {
            // Using Strapi 5 Documents Service to create entry
            // This bypasses the REST layer validation that rejects the 'user' key
            const entry = await strapi.documents('api::workspace.workspace').create({
                data: {
                    ...data,
                    user: user.id
                },
                status: 'published'
            });

            return { data: entry };
        } catch (error) {
            return ctx.badRequest(error.message || 'Error creating workspace');
        }
    },

    async find(ctx) {
        const { user } = ctx.state;
        if (!user) {
            return ctx.unauthorized('You must be logged in to see workspaces');
        }

        try {
            // Using Strapi 5 Documents Service for finding entries
            // This is more reliable than modifying ctx.query.filters in some Strapi 5 configurations
            const entries = await strapi.documents('api::workspace.workspace').findMany({
                filters: {
                    user: {
                        id: {
                            $eq: user.id
                        }
                    }
                },
                status: 'published'
            });

            // Return the results in the format the frontend expects
            return { data: entries };
        } catch (error) {
            return ctx.badRequest(error.message || 'Error fetching workspaces');
        }
    }
}));
