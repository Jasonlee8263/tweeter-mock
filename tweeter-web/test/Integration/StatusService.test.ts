import { StatusService } from "../../src/model/service/StatusService";
import "isomorphic-fetch";
describe("StatusService test", () => {
  let mockStatusService: StatusService;
  beforeAll(() => {
    mockStatusService = new StatusService();
  });
  it("Test getStory", async () => {
    const response = await mockStatusService.loadMoreStoryItems(
      "token",
      "@Jason",
      2,
      null
    );
    expect(response).toBeDefined();
    expect(response[0][0]).toBeTruthy();
  });
});
