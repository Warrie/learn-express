suite("global tests", function() {
  test("page hase valid title", function() {
    assert(
      document.title &&
        document.title.match(/\S/) &&
        document.title.toUpperCase() !== "TODO"
    );
  });
});
