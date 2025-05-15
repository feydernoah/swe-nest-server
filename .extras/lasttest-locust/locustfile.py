# Copyright (C) 2024 - present Juergen Zimmermann, Hochschule Karlsruhe
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

#Lasttest-Locust
from typing import Final

import urllib3
from locust import HttpUser, constant_throughput, task
import requests

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

KEYCLOAK_URL = "https://localhost:8880/realms/nest/protocol/openid-connect/token"
KEYCLOAK_CLIENT_ID = "nest-client"
KEYCLOAK_CLIENT_SECRET = "hFfxabQyuI8XABCM9Rlh69qQpfLFCvoq"  
KEYCLOAK_USERNAME = "admin"
KEYCLOAK_PASSWORD = "p"

# https://docs.locust.io/en/stable/api.html#httpuser-class
class BikeRequests(HttpUser):

    host = "https://localhost:3000"

    # https://docs.locust.io/en/stable/writing-a-locustfile.html#wait-time-attribute
    # https://docs.locust.io/en/stable/api.html#locust.User.wait_time
    # https://docs.locust.io/en/stable/api.html#locust.wait_time.constant_throughput
    wait_time = constant_throughput(0.1)  # 100 Requests pro Sekunde pro User
    MIN_USERS: Final = 500
    MAX_USERS: Final = 500
    token = None

    # https://docs.locust.io/en/stable/writing-a-locustfile.html#on-start-and-on-stop-methods
    def on_start(self) -> None:
        self.client.verify = False
        url = f"{self.host}/auth/token"
        headers = {"Content-Type": "application/json"}
        body = {"username": KEYCLOAK_USERNAME, "password": KEYCLOAK_PASSWORD}
        response = requests.post(url, headers=headers, json=body, verify=False)
        response.raise_for_status()
        self.token = response.json()["access_token"]

    # https://docs.locust.io/en/stable/api.html#locust.task
    # https://docs.locust.io/en/stable/api.html#locust.User.weight
    #GET-Requests mit Pfadvariable.
    @task(100)
    def get_id(self) -> None:
        id_list: Final = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        headers = {"Authorization": f"Bearer {self.token}"}
        for bike_id in id_list:
            self.client.get(f"/bike/{bike_id}", headers=headers)

    #GET-Requests mit Query-Parameter: brand.
    @task(80)
    def get_brand(self) -> None:
        brands = ["Trek", "Giant", "Specialized"]
        headers = {"Authorization": f"Bearer {self.token}"}
        for brand in brands:
            self.client.get("/bike", params={"brand": brand}, headers=headers)

    #GET-Requests mit Query-Parameter: type.
    @task(60)
    def get_type(self) -> None:
        types = ["Mountain", "Road"]
        headers = {"Authorization": f"Bearer {self.token}"}
        for t in types:
            self.client.get("/bike", params={"type": t}, headers=headers)


