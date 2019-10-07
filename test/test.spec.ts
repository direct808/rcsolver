import rcsolver from "../src/rcsolver";


describe("test", function () {

    this.timeout(Infinity);

    it('getRecaptcha', async () => {
        let result = await rcsolver("qqq");
        console.log(result);
    });
});
