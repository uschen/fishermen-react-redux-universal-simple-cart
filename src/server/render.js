import config from '../../config';
import configureStore from '../redux/configureStore';
import getRoutes from './../routes';
import { actions as fetchrActions } from './../redux/modules/fetchr';
import renderCreator from '../shared/utils/lib/server/renderCreator';

const handleRender = renderCreator(configureStore, getRoutes, config.env, fetchrActions);
export default handleRender;
