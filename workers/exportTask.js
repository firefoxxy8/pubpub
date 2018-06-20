import fs from 'fs';
import Promise from 'bluebird';
import nodePandoc from 'node-pandoc';
import tmp from 'tmp-promise';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import Latex from '@pubpub/editor/addons/Latex';
import Footnote from '@pubpub/editor/addons/Footnote';
import Citation from '@pubpub/editor/addons/Citation';
import Discussion from 'components/DiscussionAddon/DiscussionAddon';
import { Pub, Version } from '../server/models';

const dataDir = process.env.NODE_ENV === 'production'
	? '--data-dir=/app/.apt/usr/share/pandoc/data '
	: '';

export default (pubId, versionId, format)=> {

	const formatTypes = {
		docx: { output: 'docx', extension: 'docx' },
		pdf: { output: 'latex', extension: 'pdf' },
		epub: { output: 'epub', extension: 'epub' },
		html: { output: 'html', extension: 'html' },
		markdown: { output: 'markdown_strict', extension: 'md' },
		odt: { output: 'odt', extension: 'odt' },
		plain: { output: 'plain', extension: 'txt' },
		jats: { output: 'jats', extension: 'xml' },
		tex: { output: 'latex', extension: 'tex' },
	};
	const findPub = Pub.findOne({
		where: { id: pubId }
	});
	const findVersion = Version.findOne({
		where: { id: versionId }
	});

	Promise.all([findPub, findVersion])
	.then(([pubData, versionData])=> {
		return ReactDOMServer.renderToStaticMarkup(
			<html lang="en">
				<head>
					<title>Wassha! {pubData.title}</title>
				</head>
				<body>
					<h1>{pubData.title}</h1>
					<Editor
						initialContent={versionData.content}
						isReadOnly={true}
					>
						<Image
							handleResizeUrl={(url)=> { return url; }}
						/>
						<Video />
						<File />
						<Iframe />
						<Latex />
						<Footnote />
						<Citation />
						<Discussion
							// threads={props.threads}
							// slug={props.slug}
							// setActiveThread={props.setActiveThread}
						/>
					</Editor>
				</body>
			</html>
		);
	})
	.then((staticHtml)=> {
		return Promise.all([staticHtml, tmp.file({ postfix: `.${formatTypes[format].extension}` })]);
	})
	.then(([staticHtml, tmpFile])=> {
		// Arguments in either a single String or as an Array:
		// const args = '-f html -t docx -o word.docx';
		const args = `${dataDir}-f html -t ${formatTypes[format].output} -o ${tmpFile.path}`;
		// const args = `${dataDir}-f html -t json -o out.json`;
		// console.log(args);

		const convertFile = new Promise((resolve, reject)=> {
			nodePandoc(staticHtml, args, (err, result)=> {
				if (err) reject(err);
				resolve(result);
			});
		});
		return Promise.all([tmpFile, convertFile]);
	})
	.then(([tmpFile, convertResult])=> {
		console.log(convertResult);
		// fs.renameSync(tmpFile.path, `/Users/travis/Desktop/${format}.${formatTypes[format].extension}`);
	})
	.catch((err)=> {
		console.log('Error!', err);
	});

	// const fsReadFile = Promise.promisify(fs.readFile);
	// const fsWriteFile = Promise.promisify(fs.writeFile);
	// tmp.file({ postfix: '.docx' })
	// .then((tmpFile)=> {
	// 	const src = '<h1>Hello</h1><p>It&rsquo;s bananas</p>';
	// 	// Arguments in either a single String or as an Array:
	// 	// const args = '-f html -t docx -o word.docx';
	// 	const args = `${dataDir}-f html -t docx -o ${tmpFile.path}`;
	// 	// const args = `${dataDir}-f html -t json -o out.json`;
	// 	console.log(tmpFile.path);
	// 	console.log(args);

	// 	// Call pandoc
	// 	nodePandoc(src, args, (err, result)=> {
	// 		if (err) console.error('Oh no: ', err);
	// 		// Without the -o arg, the converted value will be returned.
	// 		console.log(result);
	// 		return result;
	// 	});
	// })
	// .catch((promiseErr)=> {
	// 	console.log('Error in promise chain', promiseErr);
	// });

	/*
	- get json from pubpub, convert to HTML, enter into pandoc, upload output, return url
	- get file, enter into pandoc, get html, convert into pubpub json
	- Have a 'check task' route and 'task' table that can be queried for task results

	*/	
};