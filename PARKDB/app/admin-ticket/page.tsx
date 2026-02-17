.container {
  display: grid;
  grid-template-columns: 240px 1fr 300px;
  height: 100vh;
  background: #0e0f12;
  color: white;
  font-family: Arial, sans-serif;
}

/* SIDEBAR */
.sidebar {
  background: #0a0b0d;
  padding: 30px 20px;
  border-right: 1px solid #222;
}

.sidebar h2 {
  color: #7dd3fc;
  margin-bottom: 30px;
}

.sidebar p {
  margin: 14px 0;
  color: #aaa;
}

.active {
  color: #7dd3fc !important;
}

/* MAIN */
.main {
  padding: 30px;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header button {
  background: #2a2d33;
  border: none;
  padding: 8px 14px;
  color: white;
  border-radius: 6px;
}

/* FILTER */
.filterPanel {
  position: absolute;
  right: 20px;
  top: 60px;
  background: #2a2d33;
  padding: 20px;
  border-radius: 8px;
  width: 250px;
}

/* TABLE */
.tableBox {
  border: 1px solid #2a2d33;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #2a2d33;
}

th, td {
  padding: 12px;
  border-top: 1px solid #1f2227;
}

/* ACTIONS */
.actions {
  margin-top: 20px;
}

.actions button {
  background: #7dd3fc;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin-right: 10px;
}

/* RIGHT PANEL */
.rightPanel {
  border-left: 1px solid #222;
  padding: 30px 20px;
}

.sectionTitle {
  color: #aaa;
  margin-top: 20px;
}

.timer {
  color: #facc15;
}

.announcement {
  height: 50px;
  background: #2a2d33;
  margin-top: 10px;
  border-radius: 6px;
}
