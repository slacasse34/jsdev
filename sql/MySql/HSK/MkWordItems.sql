BEGIN TRANSACTION;
CREATE TABLE `WordItems` (
  `ID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `CN` char(8) NOT NULL default '',
  `EN` varchar(32) NOT NULL default '',
  `FR` varchar(32) NOT NULL default '',
  `AFR` varchar(32) NOT NULL default '',
  `PY` varchar(32) NOT NULL default '',
  `APY` varchar(32) NOT NULL default '',
  `Lvl` tinyint(1) default 1,
  `HintPY` INTEGER NOT NULL default 0,
  `HintCN` INTEGER NOT NULL default 0,
  `HintFR` INTEGER NOT NULL default 0
);
CREATE TABLE `Hints` (
  `ID` INTEGER NOT NULL,
  `Grp` char(1) NOT NULL,
  `Hint` varchar(80) NOT NULL default '?'
);
INSERT INTO Hints (`Hint`,`Grp`,`ID`) VALUES ('PY?','P',0);
INSERT INTO Hints (`Hint`,`Grp`,`ID`) VALUES ('CN?','C',0);
INSERT INTO Hints (`Hint`,`Grp`,`ID`) VALUES ('FR?','F',0);
--CREATE TABLE sqlite_sequence(name,seq);
CREATE INDEX `ByLevel` ON `WordItems` (`Lvl`);
CREATE INDEX `ByAPY` ON `WordItems` (`APY`);
CREATE UNIQUE INDEX `ByGrpId` ON `Hints` (`ID`,`Grp`);
COMMIT;

