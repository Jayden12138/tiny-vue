import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'

describe('parse', () => {
	test('simple interpolation', () => {
		const ast = baseParse('{{message}}')

		// root
		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.INTERPOLATION, // 'interpolation'
			content: {
				type: NodeTypes.SIMPLE_EXPRESSION, // 'simple_expression'
				content: 'message',
			},
		})
	})

	test('simple element', () => {
		const ast = baseParse('<div></div>')

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: 'div',
			children: [],
		})
	})

	test('simple text', () => {
		const ast = baseParse('some text')

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.TEXT,
			content: 'some text',
		})
	})

	test('hello world', () => {
		const ast = baseParse('<div>hi,{{message}}</div>')

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: 'div',
			children: [
				{
					type: NodeTypes.TEXT,
					content: 'hi,',
				},
				{
					type: NodeTypes.INTERPOLATION,
					content: {
						type: NodeTypes.SIMPLE_EXPRESSION,
						content: 'message',
					},
				},
			],
		})
	})

	test('union: nested element', () => {
		const ast = baseParse('<div><p>hi,</p>{{message}}</div>')

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: 'div',
			children: [
				{
					type: NodeTypes.ELEMENT,
					tag: 'p',
					children: [
						{
							type: NodeTypes.TEXT,
							content: 'hi,',
						},
					],
				},
				{
					type: NodeTypes.INTERPOLATION,
					content: {
						type: NodeTypes.SIMPLE_EXPRESSION,
						content: 'message',
					},
				},
			],
		})
	})

	test('should throw error when lack end tag', () => {
		// baseParse("<div><span></div>")
		expect(() => {
			baseParse('<div><span></div>')
		}).toThrow()
	})
})
