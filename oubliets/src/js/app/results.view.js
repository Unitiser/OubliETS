export class ResultsView {
	static createResult(type, local, startAvailable, endAvailable) {
		return "<p>" + type + ": " + local + "</p><p> disponible: " + startAvailable + " - " + endAvailable + "</p>"
	}
}
