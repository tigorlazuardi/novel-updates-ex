import { type Origin } from "./content/routes/home/extract_tables";

export type Config = {
    home: {
        filter: {
            include_favorites: boolean;
            exclude_origins: Origin[];
            rating: {
                gte: {
                    enable: boolean;
                    value: number;
                };
                lte: {
                    enable: boolean;
                    value: number;
                };
            };
            votes: {
                gte: {
                    enable: boolean;
                    value: number;
                };
                lte: {
                    enable: boolean;
                    value: number;
                };
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
            exclude_origins: [],
            rating: {
                gte: {
                    enable: false,
                    value: 0,
                },
                lte: {
                    enable: false,
                    value: 5,
                },
            },
            votes: {
                gte: {
                    enable: false,
                    value: 0,
                },
                lte: {
                    enable: false,
                    value: 100_000,
                },
            },
        },
        expand_table_width: {
            enable: true,
            value: "100vw",
        },
        description: {
            paragraph_threshold: 3,
        },
        scribble_hub: {
            hide: false,
        },
    },
};
