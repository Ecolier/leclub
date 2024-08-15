import getDebugNamespace from 'debug';
import _ from 'lodash';

export const debug = _.memoize(getDebugNamespace('leclub:shared'));