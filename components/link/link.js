import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import memoize from '../global/memoize';
import dataTests from '../global/data-tests';

import ClickableLink from './clickableLink';
import styles from './link.css';

/**
 * @name Link
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays a link.
 * @extends {ReactComponent}
 * @example-file ./link.examples.html
 */

let isCompatibilityMode = false;

export function setCompatibilityMode(isEnabled) {
  isCompatibilityMode = isEnabled;
}

const makeWrapText = memoize(innerClassName => {
  const WrapText = ({className, children}) => {
    const classes = classNames(styles.inner, className, innerClassName);
    return <span className={classes}>{children}</span>;
  };

  WrapText.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  return WrapText;
});

export function linkHOC(ComposedComponent) {
  const isCustom = typeof ComposedComponent !== 'string' && ComposedComponent !== ClickableLink;

  return class Link extends Component {
    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      active: PropTypes.bool,
      inherit: PropTypes.bool,
      pseudo: PropTypes.bool,
      hover: PropTypes.bool,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      'data-test': PropTypes.string,
      href: PropTypes.string
    };

    getChildren() {
      const {children, innerClassName} = this.props;

      const WrapText = makeWrapText(innerClassName);

      return typeof children === 'function'
        ? children(WrapText)
        : <WrapText>{children}</WrapText>;
    }

    render() {
      const {
        active,
        inherit,
        pseudo,
        hover,
        className,
        'data-test': dataTest,
        href,
        // eslint-disable-next-line no-unused-vars
        innerClassName, children,
        ...props
      } = this.props;
      const useButton = pseudo || !isCustom && !href;

      const classes = classNames(styles.link, className, {
        [styles.active]: active,
        [styles.inherit]: inherit,
        [styles.hover]: hover,
        [styles.compatibilityUnderlineMode]: isCompatibilityMode,
        [styles.pseudo]: useButton
      });

      if (isCustom && !props.activeClassName) {
        props.activeClassName = styles.active;
      }

      if (useButton) {
        return (
          <button
            type="button"
            {...props}
            className={classes}
            data-test={dataTests('ring-link', dataTest)}
          >{this.getChildren()}</button>
        );
      }

      return (
        <ComposedComponent
          {...props}
          href={href}
          className={classes}
          data-test={dataTests('ring-link', dataTest)}
        >
          {this.getChildren()}
        </ComposedComponent>
      );
    }
  };
}

export default linkHOC(ClickableLink);
