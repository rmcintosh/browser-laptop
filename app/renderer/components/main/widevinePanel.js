/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// Components
const ImmutableComponent = require('../immutableComponent')
const Dialog = require('../common/dialog')
const Button = require('../common/button')
const WidevineInfo = require('./widevineInfo')
const SwitchControl = require('../common/switchControl')
const {
  CommonFormLarge,
  CommonFormTitle,
  CommonFormSection,
  CommonFormButtonWrapper,
  CommonFormBottomWrapper
} = require('../common/commonForm')

// Constants
const appConfig = require('../../../../js/constants/appConfig')

// Actions
const windowActions = require('../../../../js/actions/windowActions')
const appActions = require('../../../../js/actions/appActions')

// Utils
const siteUtil = require('../../../../js/state/siteUtil')

// Styles
const commonStyles = require('../styles/commonStyles')

class WidevinePanel extends ImmutableComponent {
  constructor () {
    super()
    this.onInstallAndAllow = this.onInstallAndAllow.bind(this)
    this.onClickRememberForNetflix = this.onClickRememberForNetflix.bind(this)
  }
  get origin () {
    return siteUtil.getOrigin(this.props.widevinePanelDetail.get('location'))
  }
  onInstallAndAllow () {
    appActions.setResourceEnabled(appConfig.resourceNames.WIDEVINE, true)
    this.props.onHide()
    // The site permissions that is set if this.props.widevinePanelDetail.get('alsoAddRememberSiteSetting') is handled once the resource is ready
    // in main.js.  This is so that the reload doesn't happen until it is ready.
  }
  onClickRememberForNetflix (e) {
    windowActions.widevinePanelDetailChanged({
      alsoAddRememberSiteSetting: e.target.value
    })
  }
  render () {
    const isLinux = process.platform === 'linux'
    if (isLinux) {
      return null
    }
    /*
       Removed 'isClickDismiss' from Dialog.
       Installing Widevine influences globally, not specific to a tab,
       like Adobe Flash. Removing isClickDismiss would make it clear that
       the third party software which we discourage from using is going
       to be installed on the computer.
    */
    return <Dialog onHide={this.props.onHide} testId='widevinePanelDialog'>
      <CommonFormLarge onClick={(e) => e.stopPropagation()}>
        <CommonFormTitle data-l10n-id='widevinePanelTitle' />
        <CommonFormSection>
          <WidevineInfo createTabRequestedAction={appActions.createTabRequested} />
        </CommonFormSection>
        <CommonFormButtonWrapper>
          <Button className='whiteButton'
            l10nId='cancel'
            testId='cancelButton'
            onClick={this.props.onHide}
          />
          <Button className='primaryButton'
            l10nId='installAndAllow'
            testId='installAndAllowButton'
            onClick={this.onInstallAndAllow} />
        </CommonFormButtonWrapper>
        <CommonFormBottomWrapper>
          <div className={css(styles.flexJustifyCenter)}>
            {/* TODO: refactor switchControl.js to remove commonStyles.noPadding */}
            <SwitchControl id={this.props.prefKey}
              className={css(commonStyles.noPadding)}
              rightl10nId='rememberThisDecision'
              rightl10nArgs={JSON.stringify({origin: this.origin})}
              onClick={this.onClickRememberForNetflix}
              checkedOn={this.props.widevinePanelDetail.get('alsoAddRememberSiteSetting')} />
          </div>
        </CommonFormBottomWrapper>
      </CommonFormLarge>
    </Dialog>
  }
}

const styles = StyleSheet.create({
  flexJustifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  }
})

module.exports = WidevinePanel
