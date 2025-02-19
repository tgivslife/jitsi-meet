import { connect } from 'react-redux';

import { createToolbarEvent } from '../../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../../analytics/functions';
import { translate } from '../../../base/i18n/functions';
import { IconShareLocation } from '../../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import { shareLocation } from '../../actions.any';

/**
 * Implementation of a button for sending location in chat as a message.
 */
class ChatShareLocationButton extends AbstractButton<AbstractButtonProps> {
    accessibilityLabel = 'toolbar.accessibilityLabel.chatShareLocation';
    icon = IconShareLocation;
    label = 'toolbar.chatShareLocation';
    tooltip = 'toolbar.chatShareLocation';

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;

        sendAnalytics(createToolbarEvent('chat-share-location'));
        dispatch(shareLocation());
    }
}

export default translate(connect()(ChatShareLocationButton));
