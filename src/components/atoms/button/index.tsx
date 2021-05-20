import React from 'react';
import { mapModifiers } from 'lib/component';
import { Link } from 'gatsby';

type Modifier = 'noBackground' | 'noBorder' | 'noPadding' | 'secondary' | 'asText' | 'icon' | 'buy' | 'bid' | 'asLink';

interface Props {
  modifiers?: Modifier | Modifier[];
  anchor?: {
    href: string;
    target?: string;
    external?: boolean;
  };
  handleClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<Props> = props => {
  return props.anchor ? (
    !props.anchor.external ? (
      <Link to={props.anchor.href} className={mapModifiers('a-button', props.modifiers)} target={props.anchor.target}>
        {props.children}
      </Link>
    ) : (
      // eslint-disable-next-line react/forbid-elements
      <a href={props.anchor.href} className={mapModifiers('a-button', props.modifiers)} target={props.anchor.target}>
        {props.children}
      </a>
    )
  ) : (
    <button
      className={mapModifiers('a-button', props.modifiers)}
      onClick={props.handleClick}
      type={props.type || 'button'}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
