import ResponseAdapter from "../../adapters/ResponseAdapter"

describe("When using the ResponseAdapter", () => {
  describe("When outputting the response", () => {
    describe("When the data is not empty", () => {
      it("Should format the response correctly", () => {
        const data = {
          thing: "The thing is here",
        }
        const expectedResponse = {
          statusCode: 200,
          body: JSON.stringify(data),
        }

        const response = new ResponseAdapter()
        const eventResponse = response.output(data, 200)
        expect(eventResponse).toEqual(expectedResponse)
      })
    })

    describe("When the data is empty", () => {
      it("Should format the response correctly", () => {
        const expectedResponse = {
          statusCode: 200,
          body: "[]",
        }

        const response = new ResponseAdapter()
        const eventResponse = response.output([], 200)
        expect(eventResponse).toEqual(expectedResponse)
      })
    })
  })
})
