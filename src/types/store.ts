import { ReleaseDetail } from "../content/routes/home/extract_tables";
import { Config } from "../config";

export interface StoreMap {
    "home::release-table::fetch-details": ReleaseDetail;
    config: Config;
}
