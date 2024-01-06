import { ReleaseDetail } from "../background/handlers/home";
import { Config } from "../config";

export interface StoreMap {
    "home::release-table::fetch-details": ReleaseDetail;
    config: Config;
}
