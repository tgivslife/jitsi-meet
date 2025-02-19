import {SHARE_LOCATION} from "./actionTypes";
import MiddlewareRegistry from "../base/redux/MiddlewareRegistry";
import {openChat, sendMessage} from "../chat/actions.web";
// @ts-expect-error
import VideoLayout from '../../../modules/UI/videolayout/VideoLayout';

/**
 * The middleware of the feature chat-share-location specific to Web/React.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const {dispatch, getState} = store;
    let isOpen;
    let messageText;

    switch (action.type) {
        case SHARE_LOCATION:
            isOpen = getState()['features/chat'].isOpen;

            if (!isOpen) {
                dispatch(openChat())

                // Recompute the large video size whenever we toggle the chat, as it takes chat state into account.
                VideoLayout.onResize();
            }

            _requestLocationPermission()
                .then((position: GeolocationPosition) => {
                    // Location permission granted.
                    if (position && position.coords) {
                        const {
                            latitude,
                            longitude,
                            accuracy,
                            altitude,
                            altitudeAccuracy,
                            heading,
                            speed
                        } = position.coords

                        messageText = `📍 My location is:`;


                        if (latitude !== null && latitude !== undefined) {
                            messageText += `\n- Latitude: ${latitude}`;
                        }
                        if (longitude !== null && longitude !== undefined) {
                            messageText += `\n- Longitude: ${longitude}`;
                        }
                        if (accuracy !== null && accuracy !== undefined) {
                            messageText += `\n- Accuracy: ±${accuracy} meters`;
                        }

                        // Include optional fields if available
                        if (altitude !== null && altitude !== undefined) {
                            messageText += `\n- Altitude: ${altitude} meters`;
                        }
                        if (altitudeAccuracy !== null && altitudeAccuracy !== undefined) {
                            messageText += `\n- Altitude Accuracy: ±${altitudeAccuracy} meters`;
                        }
                        if (heading !== null && heading !== undefined) {
                            messageText += `\n- Heading: ${heading}°`;
                        }
                        if (speed !== null && speed !== undefined) {
                            messageText += `\n- Speed: ${speed} m/s`;
                        }

                        dispatch(sendMessage(messageText));
                    } else {
                        dispatch(sendMessage("⚠️ Unable to retrieve location."));
                    }
                })
                .catch(error => {
                    // Location permission denied or error occurred.
                    console.log("Location permission not granted: " + JSON.stringify(error));
                    dispatch(sendMessage("⚠️ Unable to retrieve location."));
                });
            break;
    }

    return next(action);
});

/**
 * Helper function to request location permission.
 *
 * @returns {Promise} - A promise that resolves if permission is granted, rejects otherwise.
 */
const _requestLocationPermission = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
        );
    });
};