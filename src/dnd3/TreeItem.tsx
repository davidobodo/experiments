import { forwardRef } from "react";
import React from "react";
import classNames from "classnames";
import styles from "./TreeItem.module.css";

export const TreeItem = forwardRef(
	(
		{
			childCount,
			clone,
			depth,
			disableSelection,
			disableInteraction,
			ghost,
			handleProps,
			indentationWidth,
			indicator,
			collapsed,
			onCollapse,
			onRemove,
			style,
			value,
			wrapperRef,
			...props
		},
		ref
	) => {
		return (
			<li
				className={classNames(
					styles.Wrapper,
					clone && styles.clone,
					ghost && styles.ghost,
					indicator && styles.indicator,
					disableSelection && styles.disableSelection,
					disableInteraction && styles.disableInteraction
				)}
				ref={wrapperRef}
				style={
					{
						"--spacing": `${indentationWidth * depth}px`,
					} as React.CSSProperties
				}
				{...props}
			>
				<div className={styles.TreeItem} ref={ref} style={style}>
					<div {...handleProps} cursor="grab">
						HD
					</div>
					{onCollapse && <div onClick={onCollapse}>Coll</div>}
					<span className={styles.Text}>{value}</span>
					{!clone && onRemove && <div onClick={onRemove}>Rem</div>}
					{clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null}
				</div>
			</li>
		);
	}
);
