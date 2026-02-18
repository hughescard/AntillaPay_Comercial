import { getPublicPathByName } from "@/app/routes/publicPageConfig";

export const createPageUrl = (pageName) => getPublicPathByName(pageName);

