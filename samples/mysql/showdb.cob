data division.linkage section.01 global.procedure division.global require.local mysql.perform require using "mysql" giving mysql.local options.move object to options.move "root" to user in options.move "" to password in options.local connection.perform createConnection in mysql using options giving connection.perform query in connection using "show databases" showdbs.showdbs using err, rows, fields.if err then     display err    returnend-if.local k.local n.move length in rows to n.move 0 to k.local row.perform until k >= n    if k < n then        move rows(k) to row        display Database in row    end-if    add 1 to kend-perform.