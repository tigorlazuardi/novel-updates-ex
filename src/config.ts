import { type Origin } from "./content/routes/home/extract_tables";

export type Config = {
    home: {
        filter: {
            include_favorites: boolean;
            origins: Origin[];
            rating: {
                gte: number;
                lte: number;
            };
            votes: {
                gte: number;
                lte: number;
            };
        };
        expand_table_width: {
            enable: boolean;
            value: string;
        };
        description: {
            /**
             * If there is more paragraphs than this threshold, the description
             * will be truncated and Show More button will be added.
             */
            paragraph_threshold: number;
        };
        scribble_hub: {
            hide: boolean;
        };
    };
};

export const defaultConfig: Config = {
    home: {
        filter: {
            include_favorites: false,
            origins: [],
            rating: {
                gte: -1,
                lte: -1,
            },
            votes: {
                gte: -1,
                lte: -1,
            },
        },
        expand_table_width: {
            enable: true,
            value: "100vw",
        },
        description: {
            paragraph_threshold: 2,
        },
        scribble_hub: {
            hide: false,
        },
    },
};
