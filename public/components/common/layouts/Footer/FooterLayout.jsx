import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const FooterLayout = (props) => {
	return (
		<div className="page-part-wrapper">
			<div className="background-overlay overlay--neutral"></div>
			<div className="page-part-content">
				<div className="container">
					<div className="content-wrapper">
						<div className="l-footer">
							<hr className="l-footer_top-delimitation" />
							<div className="l-footer_top-arrow">
								<span></span>
								<span></span>
								<span></span>
							</div>
							<div className="l-footer_item">
								<div className="content-wrapper">
									<h3 className="l-footer_item-title--special" data-website-title>
										<img src="/assets/images/favicon.png" alt="pSearch's Logo" data-logo />
										{props.config['footer']['basics']['col1']['heading']}
									</h3>
									<span className="l-footer_item-title--special" data-website-sub>
										{props.config['footer']['basics']['col1']['subs']['1']}
									</span>
									<span className="l-footer_item-title--special" data-website-sub>
										{props.config['footer']['basics']['col1']['subs']['2']}
									</span>
								</div>
							</div>
							<div className="l-footer_item-group">
								<div className="l-footer_item" data-has-border>
									<div className="content-wrapper l-footer_item-summary">
										<h3 className="l-footer_item-heading">
											{props.config['footer']['basics']['col2']['heading']}
										</h3>
										<FooterLink 
											title={props.config['heading']['navigation']['linksTitles']['forum']} 
											link={props.config['heading']['navigation']['links']['forum']} />
										<FooterLink 
											title={props.config['heading']['navigation']['linksTitles']['patchNotes']}
											link={props.config['heading']['navigation']['links']['patchNotes']} />
										<FooterLink 
											title={props.config['heading']['navigation']['linksTitles']['feedback']} 
											link={props.config['heading']['navigation']['links']['feedback']} />
										<hr />
										<FooterLink 
											title={props.config['heading']['navigation']['linksTitles']['signup']} 
											link={props.config['heading']['navigation']['links']['signup']} />
										<FooterLink 
											title={props.config['heading']['navigation']['linksTitles']['login']} 
											link={props.config['heading']['navigation']['links']['login']} />
									</div>
								</div>
								<div className="l-footer_item">
									<div className="content-wrapper">
										<FooterLink 
											title={props.config['footer']['basics']['col3']['list']['1']} 
											link="#" />
										<div className="text" style={{position: 'absolute', bottom: '10px'}}>
											Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto consectetur aliquid eaque numquam. Reiciendis aliquid maiores saepe laborum rem enim placeat omnis deserunt, sint, recusandae dignissimos nobis distinctio natus tenetur?
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const FooterLink = (props) => (
	<Link className="l-footer_item-link" to={props.link}>
		<span className="l-footer_item-link_arrow fa">
			<div className="l-footer_item-link_arrow-inner">
				<span></span><span></span>
			</div>
		</span>
		<h3 className="l-footer_item-title">{props.title}</h3>
	</Link>
);

export default FooterLayout;