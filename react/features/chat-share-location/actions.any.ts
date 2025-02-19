import { SHARE_LOCATION } from './actionTypes';

/**
 * Creates a (redux) action to signal that a click/tap has been performed on
 * {@link ChatShareLocationButton} and that the execution flow for sharing location
 * to the current conference/meeting is to begin.
 *
 * @returns {{
 *     type: SHARE_LOCATION
 * }}
 */
export function shareLocation() {
    return {
        type: SHARE_LOCATION
    };
}
