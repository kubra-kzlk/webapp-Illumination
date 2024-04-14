app.use("/", async (req, res) => {
    // SEARCH GEDEELTE
    const searchQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
  
    let filteredPlayers = players;
    if (searchQuery) {
      filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().includes(searchQuery)
      );
    }
  
    // SORT GEDEELTE
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
  
    // Define a faction ranking for sorting
    const factionRanking = { alliance: 1, horde: 2, legion: 3, neutral: 4 };
  
    let SortedPlayer = [...filteredPlayers].sort((a, b) => {
      switch (sortField) {
        case "name":
          return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        case "birthdate":
          // Assuming birthdate is in a format that allows direct comparison (e.g., "YYYY-MM-DD")
          return sortDirection === "asc" ? a.birthdate.localeCompare(b.birthdate) : b.birthdate.localeCompare(a.birthdate);
        case "married":
          // Convert boolean to number for comparison (false < true)
          return sortDirection === "asc" ? Number(a.married) - Number(b.married) : Number(b.married) - Number(a.married);
        default:
          return 0;
      }
    });
  
    const sortFields = [
      { value: "name", text: "NAME", selected: sortField === "name" ? "selected" : "" },
      { value: "birthdate", text: "BIRTHDATE", selected: sortField === "birthdate" ? "selected" : "" },
      { value: 'faction', text: 'FACTION', selected: sortField === 'faction' ? 'selected' : ''},
      { value: "married", text: "MARRIED", selected: sortField === "married" ? "selected" : "" },
    ];
  
    const sortDirections = [
      { value: "asc", text: "Ascending", selected: sortDirection === "asc" ? "selected" : "" },
      { value: "desc", text: "Descending", selected: sortDirection === "desc" ? "selected" : "" },
    ];
  
    res.render("index", {
      warcraftData: SortedPlayer,
      sortFields,
      sortDirections,
      sortField,
      sortDirection,
      searchQuery,
    });
  });
