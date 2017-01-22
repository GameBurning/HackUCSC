import sqlite3

class Action():
    def __init__(self,action):
        self.action = action
        self.conn= sqlite3.connect("users.db")
        self.c = self.conn.cursor()
        self.type = action[0]
        self.usr = action[1]
        self.tarID = action[2]

    def act(self):
        if self.type == 'history':
            if self.tarID:
                self.add_his(self.usr,self.tarID)
            else:
                return self.fetch_his(self.usr)

        elif self.type == 'favorite':

            if self.tarID:
                self.add_fav(self.usr,self.tarID)
            else:
                return self.fetch_fav(self.usr)

        else:
            raise
        self.conn.commit()
        self.conn.close()



    def add_fav(self,usr,fav):
        add_fav_sql = '''INSERT INTO usersFav ('usr', 'kfav') VALUES  ('{0}','{1}')'''.format(usr,fav)
        self.c.execute(add_fav_sql)

    def add_his(self,usr,his):
        add_his_sql = '''INSERT INTO usersHis ('usr', 'his') VALUES  ('{0}','{1}')'''.format(usr,his)
        self.c.execute(add_his_sql)

    def fetch_fav(self,usr):
        fav_ids = []
        fetch_fav_sql = '''SELECT fav from usersFav where usr = '{0}' '''.format(usr)
        self.c.execute(fetch_fav_sql)
        for pair in self.c.fetchall():
            fav_ids.append(pair[0])
        return fav_ids

    def fetch_his(self,usr):
        his_ids = []
        fetch_his_sql = '''SELECT his from usersHis where usr = '{0}' '''.format(usr)
        self.c.execute(fetch_his_sql)
        for pair in self.c.fetchall():
            his_ids.append(pair[0])
        return his_ids