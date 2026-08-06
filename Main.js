import { PromoState } from "./core/state.js";
import { StorageService } from "./core/storage.js";

import { ReleaseEngine }
from "./engines/release-engine.js";

import { CampaignEngine }
from "./engines/campaign-engine.js";

import { CreativeDirector }
from "./ai/creative-director.js";


const state = new PromoState();

const storage = new StorageService();

const releaseEngine =
new ReleaseEngine();

const campaignEngine =
new CampaignEngine();

const creativeDirector =
new CreativeDirector();



window.PromoEngine = {

state,

storage,

releaseEngine,
